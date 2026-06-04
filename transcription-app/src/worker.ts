import { pipeline, env, TextStreamer } from '@huggingface/transformers';

// Skip local model check; this is done to skip interaction with the node.js filesystem module (too limited) and force either remote re-fetching or the browser-cache
env.allowLocalModels = false;

// Define the model
const MODEL_NAME = 'onnx-community/whisper-large-v3-turbo';

let transcriber: any = null;

const sendLog = (message: string) => {
    console.log(`[Worker] ${message}`);
    self.postMessage({ status: 'log', message: `[Worker] ${message}` });
};

async function getTranscriber(progress_callback: (p: any) => void) {
    if (transcriber === null) {
        sendLog(`Initializing transcriber pipeline for ${MODEL_NAME}...`);
        transcriber = await pipeline('automatic-speech-recognition', MODEL_NAME, {
            device: 'webgpu', // Try WebGPU first
            dtype: 'fp16',    // You can use fp16 for compatibility and speed
            progress_callback,
        }).catch(async (err: any) => {
            sendLog(`WebGPU failed, falling back to CPU: ${err.message}`);
            return await pipeline('automatic-speech-recognition', MODEL_NAME, {
                device: 'cpu',
                dtype: 'fp16',
                progress_callback,
            });
        });
        sendLog('Transcriber pipeline initialized successfully.');
    }
    return transcriber;
}

self.onmessage = async (event) => {
    const { audio, language, filename } = event.data;

    try {
        sendLog(`Received transcription request for "${filename}". Audio length: ${audio.length} samples`);
        const transcriber = await getTranscriber((progress: any) => {
            if (progress.status === 'progress') {
                if (progress.progress === 100) {
                    sendLog(`Model file loaded: ${progress.file}`);
                }
            } else if (progress.status === 'initiate') {
                sendLog(`Starting download/load of model file: ${progress.file}`);
            }
            self.postMessage({ status: 'progress', ...progress });
        });

        const streamer = new TextStreamer(transcriber.tokenizer, {
            skip_prompt: true,
            callback_function: (text: string) => {
                self.postMessage({ 
                    status: 'stream', 
                    text: text 
                });
            },
        });

        sendLog('Starting transcription task...');
        const startTime = performance.now();
        
        const result = await transcriber(audio, {
            language,
            task: 'transcribe',
            chunk_length_s: 30,
            stride_length_s: 5,
            return_timestamps: true,
            streamer,
        });

        const endTime = performance.now();
        sendLog(`Transcription complete in ${((endTime - startTime) / 1000).toFixed(2)} seconds.`);
        
        self.postMessage({ 
            status: 'complete', 
            result,
            filename // Send filename back
        });
    } catch (error: any) {
        sendLog(`Transcription error: ${error.message}`);
        self.postMessage({ status: 'error', error: error.message });
    }
};

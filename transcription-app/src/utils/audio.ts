export async function readAudioFromBuffer(buffer: ArrayBuffer): Promise<Float32Array> {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
    const audioBuffer = await audioContext.decodeAudioData(buffer);
    
    // We only need the first channel (mono)
    let float32Array = audioBuffer.getChannelData(0);

    // If there's a second channel, we could average them, but usually first is fine for transcription
    if (audioBuffer.numberOfChannels > 1) {
        const secondChannel = audioBuffer.getChannelData(1);
        for (let i = 0; i < float32Array.length; i++) {
            float32Array[i] = (float32Array[i] + secondChannel[i]) / 2;
        }
    }

    return float32Array;
}

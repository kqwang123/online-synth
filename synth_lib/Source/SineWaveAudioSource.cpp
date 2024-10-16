#include <JuceHeader.h>
#include <iostream>
#include <thread>
#include <atomic>

// A simple audio source that generates a sine wave
class SineWaveAudioSource : public juce::AudioSource
{
public:
    SineWaveAudioSource() : phase(0.0), phaseDelta(0.0), level(0.1)
    {
        // Set the frequency of the sine wave (440 Hz in this case, A4)
        setFrequency(440.0);
    }

    void setFrequency(double frequency)
    {
        auto sampleRate = 44100.0; // Standard sample rate
        phaseDelta = (frequency / sampleRate) * 2.0 * juce::MathConstants<double>::pi;
    }

    void prepareToPlay(int samplesPerBlockExpected, double sampleRate) override
    {
        juce::ignoreUnused(samplesPerBlockExpected, sampleRate);
    }

    void releaseResources() override {}

    void getNextAudioBlock(const juce::AudioSourceChannelInfo& bufferToFill) override
    {
        auto* leftChannel = bufferToFill.buffer->getWritePointer(0, bufferToFill.startSample);
        auto* rightChannel = bufferToFill.buffer->getWritePointer(1, bufferToFill.startSample);

        for (int sample = 0; sample < bufferToFill.numSamples; ++sample)
        {
            auto currentSample = (float) (std::sin(phase) * level);
            phase += phaseDelta;

            leftChannel[sample] = currentSample;
            rightChannel[sample] = currentSample;
        }
    }

private:
    double phase;
    double phaseDelta;
    double level;
};

int main()
{
    juce::ConsoleApplication app;
    
    juce::AudioDeviceManager deviceManager;
    deviceManager.initialiseWithDefaultDevices(0, 2); // 2 output channels, no input channels

    SineWaveAudioSource sineWave;
    juce::AudioSourcePlayer audioSourcePlayer;
    audioSourcePlayer.setSource(&sineWave);
    deviceManager.addAudioCallback(&audioSourcePlayer);

    std::atomic<bool> isPlaying{ false };

    std::cout << "Type 'play' to start the sound, 'stop' to stop, and 'quit' to exit." << std::endl;

    std::string input;
    while (true)
    {
        std::cin >> input;

        if (input == "play" && !isPlaying)
        {
            deviceManager.playTestSound(); // Starts audio playback
            isPlaying = true;
            std::cout << "Playing sound..." << std::endl;
        }
        // else if (input == "stop" && isPlaying)
        // {
        //     deviceManager.stop(); // Stops audio playback
        //     isPlaying = false;
        //     std::cout << "Stopped sound." << std::endl;
        // }
        else if (input == "quit")
        {
            break;
        }
    }

    // Clean up
    deviceManager.removeAudioCallback(&audioSourcePlayer);
    audioSourcePlayer.setSource(nullptr);

    return 0;
}

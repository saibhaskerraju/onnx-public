import React, { useEffect, useState } from 'react';
import * as ort from 'onnxruntime-web';

const ONNXModelComponent = () => {
  const [session, setSession] = useState<ort.InferenceSession | null>(null);
  const [inputData, setInputData] = useState<string>('');
  const [outputValue, setOutputValue] = useState<number | null>(null);

  useEffect(() => {
    const loadModel = async () => {
      try {
        const modelUrl = '/assets/linear_regression_model.onnx'; // Update with the correct path to your ONNX model
        const session = await ort.InferenceSession.create(modelUrl);
        setSession(session);
      } catch (error) {
        console.error('Failed to load ONNX model', error);
      }
    };

    loadModel();
  }, []);

  const runInference = async (inputData: number[]) => {
    if (!session) {
      console.error('Model is not loaded yet');
      return;
    }

    const inputTensor = new ort.Tensor('float32', inputData, [1, inputData.length]);
    const feeds = { input: inputTensor };
    const results = await session.run(feeds);
    const outputTensor = results[Object.keys(results)[0]];
    const outputValue = outputTensor.data[0] as number;
    setOutputValue(outputValue);
    console.log('Inference result:', outputValue);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputData(event.target.value);
  };

  const handleButtonClick = () => {
    const final = inputData.split(',').map(Number);
    runInference(final);
  };

  return (
    <div>
      <h1>ONNX Model Inference</h1>
      <input type="text" value={inputData} onChange={handleInputChange} placeholder="Enter input data" />
      <button onClick={handleButtonClick}>
        Run Inference
      </button>
      {outputValue !== null && (
        <div>
          <h2>Output Value:</h2>
          <p>{outputValue}</p>
        </div>
      )}
    </div>
  );
};

export default ONNXModelComponent;
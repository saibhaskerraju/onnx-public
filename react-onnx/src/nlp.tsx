import './App.css';
import React, { useState, useEffect } from 'react';
import { inference, columnNames } from './inference.js';
import Chart from 'react-google-charts';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import * as ort from 'onnxruntime-web';

const TextInputArea: React.FC = () => {
  const [session, setSession] = useState<ort.InferenceSession>();
  const [text, setText] = useState('Enter text to classify emotion, model trained on English text.');
  const [data, setData] = useState(columnNames);
  const [latency, setLatency] = useState(0.0);
  const [downloading, setDownloading] = useState(true);

  useEffect(() => {
    const loadModel = async () => {
      try {
        const modelUrl = '/assets/xtremedistill-go-emotion-int8.onnx'; // Update with the correct path to your ONNX model
        const session = await ort.InferenceSession.create(modelUrl);
        setSession(session);
        setDownloading(false);
      } catch (error) {
        console.error('Failed to load ONNX model', error);
      }
    };

    loadModel();
  }, []);


  const handleChange = async (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (session) {
      const result = await inference(event.target.value, session);
      setText(event.target.value);
      setData(result[1]);
      setLatency(result[0]);
    } else {
      console.error('Inference session is not initialized.');
    }
  };

  return (
    <div className="App">
      <h3>This is a Sentiment Analysis model that takes string as input and gives out sentiment based on score matching</h3>
        <Chart
          width={'400px'}
          height={'300px'}
          chartType="BarChart"
          data={data}
        />

        {downloading && (
          <div>
            <span style={{ fontSize: 'small' }}>Downloading model from CDN to browser..</span>
            <Box sx={{ width: '400px' }}>
              <LinearProgress />
            </Box>
            <p></p>
          </div>
        )}
        <textarea
          rows={8}
          cols={80}
          className="App-textarea"
          name="message"
          placeholder={text}
          autoFocus
          onChange={handleChange}
        ></textarea>
        <div>
          <span style={{ fontSize: '16px' }}>Inference Latency {latency} ms</span>
        </div>
    
    </div>
  );
};

export default TextInputArea;
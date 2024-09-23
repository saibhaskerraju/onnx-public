/** */
/*global BigInt */
/*global BigInt64Array */

import { InferenceSession } from 'onnxruntime-web';
import { loadTokenizer } from './bert_tokenizer.ts';
import * as ort from 'onnxruntime-web';

// Setup onnxruntime 
// requires Cross-Origin-*-policy headers https://web.dev/coop-coep/

// const options: InferenceSession.SessionOptions  = {
//   executionProviders: ['wasm'], 
//   graphOptimizationLevel: 'all'
// };

// let downLoadingModel: boolean = true;
// const model: string = "/assets/xtremedistill-go-emotion-int8.onnx";

// const session = ort.InferenceSession.create(model);
// session.then(() => { 
//   downLoadingModel = false;
//   // warmup the VM
//   for(let i = 0; i < 10; i++) {
//     console.log("Inference warmup " + i);
//     lm_inference("this is a warmup inference");
//   }
//   console.log("Inference warmup done");
//   //downLoadingModel = true;
// });

const tokenizer = loadTokenizer();

const EMOJI_DEFAULT_DISPLAY: [string, number | string][] = [
  ['Emotion', 'Score'],
  ['admiration 👏', 0],
  ['amusement 😂', 0],
  ['neutral 😐', 0],
  ['approval 👍', 0],
  ['joy 😃', 0],
  ['gratitude 🙏', 0],
];

const EMOJIS: string[] = [
  'admiration 👏',
  'amusement 😂',
  'anger 😡',
  'annoyance 😒',
  'approval 👍',
  'caring 🤗',
  'confusion 😕',
  'curiosity 🤔',
  'desire 😍',
  'disappointment 😞',
  'disapproval 👎',
  'disgust 🤮',
  'embarrassment 😳',
  'excitement 🤩',
  'fear 😨',
  'gratitude 🙏',
  'grief 😢',
  'joy 😃',
  'love ❤️',
  'nervousness 😬',
  'optimism 🤞',
  'pride 😌',
  'realization 💡',
  'relief😅',
  'remorse 😞', 
  'sadness 😞',
  'surprise 😲',
  'neutral 😐'
];

// function isDownloading(): boolean {
//   console.log(downLoadingModel)
//   return downLoadingModel;
// }

function sortResult(a: [string, number], b: [string, number]): number {
  if (a[1] === b[1]) {
    return 0;
  } else {
    return (a[1] < b[1]) ? 1 : -1;
  }
}

function sigmoid(t: number): number {
  return 1 / (1 + Math.pow(Math.E, -t));
}

function create_model_input(encoded: number[]): { input_ids: ort.Tensor, attention_mask: ort.Tensor, token_type_ids: ort.Tensor } {
  let input_ids: bigint[] = new Array(encoded.length + 2);
  let attention_mask: bigint[] = new Array(encoded.length + 2);
  let token_type_ids: bigint[] = new Array(encoded.length + 2);
  input_ids[0] = BigInt(101);
  attention_mask[0] = BigInt(1);
  token_type_ids[0] = BigInt(0);
  let i = 0;
  for (; i < encoded.length; i++) { 
    input_ids[i + 1] = BigInt(encoded[i]);
    attention_mask[i + 1] = BigInt(1);
    token_type_ids[i + 1] = BigInt(0);
  }
  input_ids[i + 1] = BigInt(102);
  attention_mask[i + 1] = BigInt(1);
  token_type_ids[i + 1] = BigInt(0);
  const sequence_length = input_ids.length;
  const input_ids_tensor = new ort.Tensor('int64', BigInt64Array.from(input_ids), [1, sequence_length]);
  const attention_mask_tensor = new ort.Tensor('int64', BigInt64Array.from(attention_mask), [1, sequence_length]);
  const token_type_ids_tensor = new ort.Tensor('int64', BigInt64Array.from(token_type_ids), [1, sequence_length]);
  return {
    input_ids: input_ids_tensor,
    attention_mask: attention_mask_tensor,
    token_type_ids: token_type_ids_tensor
  }
}

async function lm_inference(text: string, session: ort.InferenceSession): Promise<[number, [string, number | string][]]> {
  try { 
    const encoded_ids = await tokenizer.then(t => {
      return t.tokenize(text); 
    });
    if (encoded_ids.length === 0) {
      return [0.0, EMOJI_DEFAULT_DISPLAY];
    }
    const start = performance.now();
    const model_input = create_model_input(encoded_ids);
    const output = await session.run(model_input, ['output_0']);
    const duration = (performance.now() - start).toFixed(1);
    const probs = Array.from(output['output_0'].data as BigInt64Array, t => sigmoid(Number(t))).map(t => Math.floor(t * 100));
    
    const result: [string, number][] = [];
    for (let i = 0; i < EMOJIS.length; i++) {
      const t: [string, number] = [EMOJIS[i], probs[i]];
      result[i] = t;
    }
    result.sort(sortResult); 
    
    const result_list: [string, number | string][] = [];
    result_list[0] = ["Emotion", "Score"];
    for (let i = 0; i < 6; i++) {
      result_list[i + 1] = result[i];
    }
    return [parseFloat(duration), result_list];    
  } catch (e) {
    return [0.0, EMOJI_DEFAULT_DISPLAY];
  }
}    

export let inference = lm_inference;
export let columnNames = EMOJI_DEFAULT_DISPLAY;
//export let modelDownloadInProgress = isDownloading;
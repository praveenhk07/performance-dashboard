const MAX_POINTS = 100000;
let dataBuffer = [];

self.onmessage = (e) => {
  const { type, payload } = e.data;

  if (type === "INIT") {
    dataBuffer = payload;
    self.postMessage({ type: "BUFFER_UPDATED", data: dataBuffer });
  }

  if (type === "PUSH_BATCH") {
    // Append incoming SSE batch to worker buffer
    dataBuffer.push(...payload);

    // Enforce 100k point ceiling via fast array slice
    if (dataBuffer.length > MAX_POINTS) {
      dataBuffer = dataBuffer.slice(dataBuffer.length - MAX_POINTS);
    }

    // Compute basic statistics off-thread
    let minVal = Infinity;
    let maxVal = -Infinity;
    let sum = 0;

    for (let i = 0; i < dataBuffer.length; i++) {
      const val = dataBuffer[i].value;
      if (val < minVal) minVal = val;
      if (val > maxVal) maxVal = val;
      sum += val;
    }

    const stats = {
      count: dataBuffer.length,
      min: minVal,
      max: maxVal,
      avg: sum / (dataBuffer.length || 1),
    };

    self.postMessage({ type: "BUFFER_UPDATED", data: dataBuffer, stats });
  }

  if (type === "CLEAR") {
    dataBuffer = [];
    self.postMessage({ type: "BUFFER_UPDATED", data: [] });
  }
};
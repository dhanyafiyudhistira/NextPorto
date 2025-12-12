/**
 * Traffic SCADA API Service
 * Handles API calls with automatic fallback to mock data
 */

const MOCK_SAMPLE = {
  intersection_id: "INT_001",
  timestamp_actual: "2025-12-12T02:34:56.789Z",
  timestamp_predicted: "2025-12-12T02:34:51.789Z",
  actual: {
    phase_id: "NS_GREEN",
    phase_duration_sec: 28.5,
    started_at: "2025-12-12T02:34:30.000Z"
  },
  predicted: {
    phase_id: "NS_YELLOW",
    expected_start: "2025-12-12T02:34:51.789Z",
    lead_seconds: 5,
    confidence: 0.82,
    predicted_duration_sec: 4.1
  },
  detectors: {
    lanes: [
      { id: "NS_LEFT", flow: 3, queue: 2, avg_speed: 25.3 },
      { id: "NS_STRAIGHT", flow: 22, queue: 4, avg_speed: 32.1 },
      { id: "EW_LEFT", flow: 2, queue: 1, avg_speed: 28.5 },
      { id: "EW_STRAIGHT", flow: 18, queue: 3, avg_speed: 35.2 }
    ],
    total_flow: 45,
    avg_speed: 30.3,
    occupancy_percent: 72.4,
    avg_queue: 2.5
  },
  actuators: {
    signal_controller_mode: "AUTO",
    manual_override: false
  },
  meta: {
    camera_image: null,
    notes: "mock sample"
  }
};

class TrafficAPI {
  constructor(baseURL = '/api/scada/traffic', useMock = false) {
    this.baseURL = baseURL;
    this.useMock = useMock;
  }

  /**
   * Toggle between mock and real API
   */
  setMockMode(enabled) {
    this.useMock = enabled;
  }

  /**
   * Fetch single traffic sample
   * @param {number} lead - Lead seconds for prediction
   * @returns {Promise<Object>}
   */
  async getSample(lead = 5) {
    if (this.useMock) {
      return this._generateMockSample(lead);
    }

    try {
      const response = await fetch(`${this.baseURL}/sample?lead=${lead}`);
      if (!response.ok) throw new Error('API request failed');
      return await response.json();
    } catch (error) {
      console.warn('API failed, falling back to mock data:', error);
      return this._generateMockSample(lead);
    }
  }

  /**
   * Fetch timeseries data
   * @param {number} n - Number of samples
   * @param {number} lead - Lead seconds
   * @param {number} interval - Interval between samples
   * @returns {Promise<Object>}
   */
  async getTimeseries(n = 50, lead = 5, interval = 1) {
    if (this.useMock) {
      return this._generateMockTimeseries(n, lead, interval);
    }

    try {
      const response = await fetch(
        `${this.baseURL}/timeseries?n=${n}&lead=${lead}&interval=${interval}`
      );
      if (!response.ok) throw new Error('API request failed');
      return await response.json();
    } catch (error) {
      console.warn('API failed, falling back to mock data:', error);
      return this._generateMockTimeseries(n, lead, interval);
    }
  }

  /**
   * Generate mock sample with current timestamp
   */
  _generateMockSample(lead = 5) {
    const now = new Date();
    const phases = [
      { id: "NS_GREEN", duration: 30 },
      { id: "NS_YELLOW", duration: 4 },
      { id: "EW_GREEN", duration: 25 },
      { id: "EW_YELLOW", duration: 4 },
      { id: "ALL_RED", duration: 2 }
    ];

    const actualIndex = Math.floor(Math.random() * phases.length);
    const nextIndex = (actualIndex + 1) % phases.length;
    const actualPhase = phases[actualIndex];
    const predictedPhase = phases[nextIndex];

    const predictedTime = new Date(now.getTime() - lead * 1000);

    const lanes = [
      {
        id: "NS_LEFT",
        flow: Math.floor(Math.random() * 6),
        queue: Math.floor(Math.random() * 12),
        avg_speed: Number((Math.random() * 35 + 5).toFixed(1))
      },
      {
        id: "NS_STRAIGHT",
        flow: Math.floor(Math.random() * 25 + 5),
        queue: Math.floor(Math.random() * 20),
        avg_speed: Number((Math.random() * 40 + 10).toFixed(1))
      },
      {
        id: "EW_LEFT",
        flow: Math.floor(Math.random() * 6),
        queue: Math.floor(Math.random() * 12),
        avg_speed: Number((Math.random() * 35 + 5).toFixed(1))
      },
      {
        id: "EW_STRAIGHT",
        flow: Math.floor(Math.random() * 25 + 3),
        queue: Math.floor(Math.random() * 20),
        avg_speed: Number((Math.random() * 40 + 10).toFixed(1))
      }
    ];

    const total_flow = lanes.reduce((sum, l) => sum + l.flow, 0);
    const avg_speed = Number(
      (lanes.reduce((sum, l) => sum + l.avg_speed, 0) / lanes.length).toFixed(1)
    );
    const avg_queue = Number(
      (lanes.reduce((sum, l) => sum + l.queue, 0) / lanes.length).toFixed(1)
    );

    return {
      intersection_id: "INT_001",
      timestamp_actual: now.toISOString(),
      timestamp_predicted: predictedTime.toISOString(),
      actual: {
        phase_id: actualPhase.id,
        phase_duration_sec: Number(
          (actualPhase.duration * (0.8 + Math.random() * 0.4)).toFixed(1)
        ),
        started_at: new Date(
          now.getTime() - Math.random() * actualPhase.duration * 1000
        ).toISOString()
      },
      predicted: {
        phase_id: predictedPhase.id,
        expected_start: predictedTime.toISOString(),
        lead_seconds: lead,
        confidence: Number((Math.random() * 0.39 + 0.6).toFixed(2)),
        predicted_duration_sec: Number(
          (predictedPhase.duration * (0.8 + Math.random() * 0.4)).toFixed(1)
        )
      },
      detectors: {
        lanes,
        total_flow,
        avg_speed,
        occupancy_percent: Number((Math.random() * 85 + 10).toFixed(1)),
        avg_queue
      },
      actuators: {
        signal_controller_mode: Math.random() < 0.01 ? "FAULT" : "AUTO",
        manual_override: false
      },
      meta: {
        camera_image: null,
        notes: "mock sample"
      }
    };
  }

  /**
   * Generate mock timeseries
   */
  _generateMockTimeseries(n = 50, lead = 5, interval = 1) {
    const data = [];
    const start = Date.now();

    for (let i = 0; i < n; i++) {
      const mockSample = this._generateMockSample(lead);
      // Adjust timestamp to create historical series
      const sampleTime = new Date(start + i * interval * 1000);
      mockSample.timestamp_actual = sampleTime.toISOString();
      mockSample.timestamp_predicted = new Date(
        sampleTime.getTime() - lead * 1000
      ).toISOString();
      data.push(mockSample);
    }

    return {
      count: n,
      lead_seconds: lead,
      interval_seconds: interval,
      data
    };
  }
}

export default new TrafficAPI();

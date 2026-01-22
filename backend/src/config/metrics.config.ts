import prometheus from 'prom-client';

export const metrics = {
  // HTTP request duration
  httpRequestDuration: new prometheus.Histogram({
    name: 'http_request_duration_ms',
    help: 'HTTP request duration in milliseconds',
    labelNames: ['method', 'route', 'status_code'],
    buckets: [50, 100, 200, 500, 1000, 2500]
  }),

  // Database query duration
  dbQueryDuration: new prometheus.Histogram({
    name: 'db_query_duration_ms',
    help: 'Database query duration in milliseconds',
    labelNames: ['operation', 'model'],
    buckets: [10, 50, 100, 250, 500]
  }),

  // Active connections
  activeConnections: new prometheus.Gauge({
    name: 'active_connections',
    help: 'Number of active connections'
  }),

  // Socket events
  socketEvents: new prometheus.Counter({
    name: 'socket_events_total',
    help: 'Total socket events by type',
    labelNames: ['event_type']
  })
};

export const register = prometheus.register;

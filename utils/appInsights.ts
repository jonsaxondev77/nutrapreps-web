import { ApplicationInsights } from '@microsoft/applicationinsights-web';

const connectionString = process.env.NEXT_PUBLIC_APPLICATION_INSIGHTS_CONNECTION_STRING;

export const appInsights = new ApplicationInsights({
  config: {
    connectionString,
    enableAutoRouteTracking: true // Optional: enables automatic page view tracking
  }
});

appInsights.loadAppInsights();
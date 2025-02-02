import { Theme } from "@nivo/core";

export const nivoTheme: Theme = {
  background: "transparent",
  text: {
    fontSize: 11,
    fill: "#333333",
    outlineWidth: 0,
    outlineColor: "transparent",
  },
  axis: {
    domain: {
      line: {
        stroke: "#777777",
        strokeWidth: 1,
      },
    },
    legend: {
      text: {
        fontSize: 12,
        fill: "#333333",
      },
    },
    ticks: {
      line: {
        stroke: "#777777",
        strokeWidth: 1,
      },
      text: {
        fontSize: 11,
        fill: "#333333",
      },
    },
  },
  grid: {
    line: {
      stroke: "#dddddd",
      strokeWidth: 1,
    },
  },
  legends: {
    text: {
      fill: "#333333",
    },
  },
  annotations: {
    text: {
      fill: "#333333",
      outlineWidth: 2,
      outlineColor: "#ffffff",
      outlineOpacity: 1,
    },
    link: {
      stroke: "#000000",
      strokeWidth: 1,
      outlineWidth: 2,
      outlineColor: "#ffffff",
      outlineOpacity: 1,
    },
    outline: {
      stroke: "#000000",
      strokeWidth: 2,
      outlineWidth: 2,
      outlineColor: "#ffffff",
      outlineOpacity: 1,
    },
    symbol: {
      fill: "#000000",
      outlineWidth: 2,
      outlineColor: "#ffffff",
      outlineOpacity: 1,
    },
  },
  labels: {
    text: {
      fill: "#333333",
    },
  },
  markers: {
    lineColor: "#000000",
    lineStrokeWidth: 1,
    text: {
      fill: "#333333",
      fontFamily: "Inter",
      fontSize: 11,
      outlineWidth: 0,
      outlineColor: "#000000",
      outlineOpacity: 1,
    },
  },

  dots: {
    text: {
      fill: "#333333",
    },
  },
  tooltip: {
    container: {
      background: "#ffffff",
      color: "#333333",
      fontSize: 12,
    },
  },
};

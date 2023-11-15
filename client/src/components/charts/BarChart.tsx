import React, { PureComponent, ReactNode } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface DataPoint {
  nilai: string;
  jumlah: number;
}

const data: DataPoint[] = [
  {
    nilai: "1",
    jumlah: 2400,
  },
  {
    nilai: "2",
    jumlah: 1398,
  },
  {
    nilai: "3",
    jumlah: 9800,
  },
  {
    nilai: "4",
    jumlah: 3908,
  },
];

export default class CustomBarChart extends PureComponent {
  //   static demoUrl = "https://codesandbox.io/s/bar-chart-has-no-padding-jphoc";

  render(): ReactNode {
    return (
      <div className="text-center mt-auto">
        <h1 className="text-lg font-medium underline">Diagram IPK</h1>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            width={500}
            height={300}
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
            barSize={20}
          >
            <XAxis
              dataKey="nilai"
              scale="point"
              padding={{ left: 10, right: 10 }}
            />
            <YAxis />
            <Tooltip />
            <Legend />
            <CartesianGrid strokeDasharray="3 3" />
            <Bar dataKey="jumlah" fill="#8884d8" background={{ fill: "#eee" }} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }
}

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
    jumlah: 100,
  },
  {
    nilai: "2",
    jumlah: 200,
  },
  {
    nilai: "3",
    jumlah: 300,
  },
  {
    nilai: "4",
    jumlah: 400,
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
                        <YAxis
              // Menetapkan ticks pada sumbu Y
              ticks={[100, 200, 300, 400]}
            />
            <Tooltip />
            <Legend />
            <CartesianGrid strokeDasharray="3 3" />
            <Bar dataKey="jumlah" fill="#" background={{ fill: "#eee" }} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }
}

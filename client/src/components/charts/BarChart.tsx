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
  semester: number;
  Semester: number;
}

const data: DataPoint[] = [
  {
    semester: 1,
    Semester: 1,
  },
  {
    semester: 2,
    Semester: 2,
  },
  {
    semester: 3,
    Semester: 3,
  },
  {
    semester: 4,
    Semester: 4,
  },
  {
    semester: 5,
    Semester: 3.86,
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
              dataKey="semester"
              scale="point"
              padding={{ left: 10, right: 10 }}
            />
                        <YAxis
              // Menetapkan ticks pada sumbu Y
              ticks={[1, 2, 3, 4]}
            />
            <Tooltip />
            <Legend />
            <CartesianGrid strokeDasharray="3 3" />
            <Bar dataKey="Semester" fill="#" background={{ fill: "#eee" }}/>
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }
}
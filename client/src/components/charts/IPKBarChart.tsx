import React, { PureComponent, ReactNode, useEffect, useState } from "react";
import axios from "axios";
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
import { useSession } from "next-auth/react";

interface DiagramIPK {
  semester: string;
  ipk: string;
}

const IPKBarChart: React.FC = () => {
  const [data, setData] = useState<DiagramIPK[]>([]);
  const { data: session } = useSession();
  const accessToken = session?.user?.access_token;

  const fetchDataBar = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/mahasiswa/ipkGraphMahasiswaBoard",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log(response.data);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (session) {
      fetchDataBar();
    }
  }, [session]);

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
          <YAxis ticks={[1, 2, 3, 4]} />
          <Tooltip />
          <Legend />
          <CartesianGrid strokeDasharray="3 3" />
          <Bar dataKey="ipk" fill="#FFA500" background={{ fill: "#eee" }} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default IPKBarChart;

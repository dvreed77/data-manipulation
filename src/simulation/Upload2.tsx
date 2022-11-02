import { Chart } from "./Chart";
import { generateData } from "./utils";
import { VegaLite, VisualizationSpec } from "react-vega";

import { keyBy } from "lodash";
import dayjs, { Dayjs } from "dayjs";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import { useEffect, useState } from "react";
import { Button, Slider, Typography } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import * as d3 from "d3";

export const Upload2 = () => {
  const [uploadDate, setUploadDate] = useState<Dayjs | null>(dayjs());
  const [lastDate, setLastDate] = useState<Dayjs | null>(dayjs());
  const [nDays, setNDays] = useState<number>(10);

  const [uploads, setUploads] = useState<any>([]);
  const uploadedData = generateData({ gap: 30 });

  const lineData = [
    { color: "black", date: new Date() },
    ...uploads.map((upload: any) => {
      return { color: upload.color, date: upload.uploadDate.toDate() };
    }),
  ];

  const spec = {
    width: 1000,
    height: 200,
    layer: [
      {
        data: { name: "uploadedData" },
        source: "uploadedData",
        mark: "line",
        encoding: {
          x: { field: "date", type: "temporal" },
          y: { field: "sales", type: "quantitative" },
        },
        axisX: false,
        axisY: false,
      },
      ...uploads.map((upload: any, idx: number) => ({
        data: { name: `data-${idx}` },
        source: "uploadedData",
        mark: "line",
        encoding: {
          x: { field: "date", type: "temporal" },
          y: { field: "sales", type: "quantitative" },
          color: { value: upload.color, legend: "Dave" },
        },
      })),
      {
        data: { name: "lineData" },
        mark: "rule",
        encoding: {
          x: { field: "date", type: "temporal" },
          color: { field: "color" },
          opacity: { value: 0.5 },
          size: { value: 4 },
        },
      },
    ],
  };

  console.log(spec, lineData);

  useEffect(() => {
    setLastDate(uploadDate);
  }, [uploadDate]);

  const colors = d3.schemeCategory10;

  const newData: any = {};
  uploads
    .map(({ lastDate, nDays }: any, idx: number) =>
      generateData({ endDate: lastDate.toDate(), nDays, gap: 0 })
    )
    .forEach((d: any, idx: number) => {
      const key = `data-${idx}`;
      newData[key] = d;
    });

  function handleUpload() {
    const key = `${uploadDate?.format("DDMMYYYY")}_${lastDate?.format(
      "DDMMYYYY"
    )}}`;

    if (!uploads.find((upload: any) => upload.key === key)) {
      setUploads((uploads: any) => {
        const newUploads = [
          ...uploads,
          { key, uploadDate, lastDate, nDays, color: "green" },
        ];

        return newUploads;
      });
    }
  }

  function deleteUpload(key: string) {
    console.log(key);
    setUploads(uploads.filter((upload: any) => upload.key !== key));
  }

  return (
    <div className="flex flex-col">
      <VegaLite spec={spec} data={{ uploadedData, ...newData, lineData }} />

      <div className="flex flex-row">
        <div className="w-1/5 mx-5">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DesktopDatePicker
              className="w-full"
              label="Upload Date"
              inputFormat="MM/DD/YYYY"
              value={uploadDate}
              onChange={(e) => setUploadDate(e)}
              renderInput={(params) => <TextField {...params} />}
              minDate={dayjs()}
            />

            <Typography id="non-linear-slider" gutterBottom>
              Days of data: {nDays} days
            </Typography>
            <Slider
              className="w-full"
              aria-label="Small steps"
              step={1}
              //   marks
              min={2}
              max={50}
              value={nDays}
              onChange={(e, v) => setNDays(v as number)}
              valueLabelDisplay="auto"
            />
            <DesktopDatePicker
              className="w-full"
              label="Last Date"
              inputFormat="MM/DD/YYYY"
              value={lastDate}
              onChange={(e) => setLastDate(e)}
              renderInput={(params) => <TextField {...params} />}
              maxDate={uploadDate}
            />
            <Button variant="contained" onClick={handleUpload}>
              Upload
            </Button>
          </LocalizationProvider>
        </div>
        <div>
          <div>Trained On Uploaded {dayjs().toString()}</div>
          {uploads.map((u: any) => (
            <div
              key={u.key}
              className="flex flex-row items-center m-3 border rounded p-2 pr-5"
            >
              <Button onClick={() => deleteUpload(u.key)}>
                <ClearIcon />
              </Button>
              <div>
                {u.nDays} days ending on {u.lastDate.format("MM/DD/YYYY")}{" "}
                uploaded on {u.uploadDate.format("MM/DD/YYYY")}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

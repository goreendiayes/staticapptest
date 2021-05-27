import React, { useRef, useEffect, useState, Fragment } from "react";
import { useSelector } from 'react-redux';
import { makeStyles } from "@material-ui/core/styles";

import {SIDE_DRAWER_WIDTH} from '~/src/common/constants';
import FormLabel from '@material-ui/core/FormLabel';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


import * as d3 from 'd3';

const lineChartHeight = 200;
const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        overflow: 'hidden',
    },
    label: {
        margin: '20px 10px 10px 20px',
        width: '100%',
        whiteSpace: 'pre-line',
      }
}));
//https://recharts.org/en-US/examples/LegendEffectOpacity
export default function Chart() {
    const classes = useStyles();

    const [opacity, setOpacity] = useState({
        uv: 1,
        pv: 1,
      });
    const policyarea_selected = useSelector((s)=>{
      return s.UI.policyarea_selected;
    });
    const policyarea_breadcrumb = useSelector((s) => {
      return s.UI.policyarea_breadcrumb;
    });


    useEffect(() => {
      if (policyarea_selected) {
  
      }
    });
    const handleMouseEnter = (o) => {
        const { dataKey } = o;
        const { opacity } = opacity;
    
  /*       this.setState({
          opacity: { ...opacity, [dataKey]: 0.5 },
        }); */
      };
    
      const handleMouseLeave = (o) => {
        const { dataKey } = o;
        const { opacity } = opacity;
    
      /*   this.setState({
          opacity: { ...opacity, [dataKey]: 1 },
        }); */
      };

    return (
      <React.Fragment>
        {policyarea_selected && (
          <div className={classes.root}>
              <FormLabel component="legend" className={classes.label}>
              {policyarea_breadcrumb.replaceAll(">", " > ")}
            </FormLabel>
            <ResponsiveContainer width="100%" height={lineChartHeight}>
              <LineChart
                width={SIDE_DRAWER_WIDTH}
                height={lineChartHeight}
                data={data}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                />
                <Line
                  type="monotone"
                  dataKey="Aggregated"
                  //strokeOpacity={opacity.pv}
                  stroke="#000000"
                  activeDot={{ r: 8 }}
                />
                <Line
                  type="monotone"
                  dataKey="Palms"
                  //strokeOpacity={opacity.pv}
                  stroke="rgb(153,27,30)"
                />
                <Line
                  type="monotone"
                  dataKey="Acton"
                  //strokeOpacity={opacity.uv}
                  stroke="rgb(252,205,9)" 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </React.Fragment>
    );
}

const data = [
    {
      name: '2014',
      Aggregated: 3333,
      Acton: 4000,
      Palms: 2400,
      amt: 2400,
    },
    {
      name: '2015',
      Aggregated: 3570,
      Acton: 3000,
      Palms: 1398,
      amt: 2210,
    },
    {
      name: '2016',
      Aggregated: 3809,
      Acton: 2000,
      Palms: 9800,
      amt: 2290,
    },
    {
      name: '2017',
      Aggregated: 3333,
      Acton: 2780,
      Palms: 3908,
      amt: 2000,
    },
    {
      name: '2018',
      Aggregated: 2759,
      Acton: 1890,
      Palms: 4800,
      amt: 2181,
    },
    {
      name: '2019',
      Aggregated: 2638,
      Acton: 2390,
      Palms: 3800,
      amt: 2500,
    },
    {
      name: '2020',
      Aggregated: 3950,
      Acton: 3490,
      Palms: 4300,
      amt: 2100,
    },
  ];
import React, { useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import { makeStyles } from "@material-ui/core/styles";

import Typography from '@material-ui/core/Typography';
import FormLabel from '@material-ui/core/FormLabel';

import * as d3 from 'd3';
import legend from 'd3-svg-legend'



const svgselect = "svg#d3legend";
const useStyles = makeStyles((theme) => ({
    root: {
      position: 'absolute',
      bottom: 50,
      right: 20,
      backgroundColor: '#ffffff',
    },
    label: {
      margin: '10px 0 0 10px',
      width: '200px',
      whiteSpace: 'pre-line',
    }
}));
//https://d3-legend.susielu.com/
//https://meyerweb.com/eric/tools/color-blend/#:::hex
export default function Legend() {
    const classes = useStyles();

    const policyarea_selected = useSelector((s)=>{
      return s.UI.policyarea_selected;
    });
    const policyarea_breadcrumb = useSelector((s) => {
      return s.UI.policyarea_breadcrumb;
    });
    const domain = useSelector((s) => {
      let d = s.UI.domain;
      if(d && d.length>5){
        d = d.slice(d.length-5, d.length);
      }else{ 
        d=[];
      }
      return d
    });


    useEffect(() => {
      if (policyarea_selected) {

        let range = [
          "#a82727",///'rgb(153,27,30)', // red 
          "#be5227",//'rgb(183,80,24)',
          "#d47d27",//'rgb(202,116,20)',
          "#e9a927",//'rgb(222,152,15)',
          "#ffd427",//'rgb(252,205,9)', //yellow */ 
        ].reverse();
        var thresholdScale = d3.scaleThreshold().domain(domain).range(range);

        var svg = d3.select(svgselect);

        svg
          .append("g")
          .attr("class", "legendQuant")
          .attr("transform", "translate(20,20)");

        var lgnd = legend
          .legendColor()
          .labelFormat(d3.format(".2s"))
          .labels(legend.legendHelpers.thresholdLabels)
          .useClass(false)
          .scale(thresholdScale)
          .ascending(true);

        svg.select(".legendQuant").call(lgnd);
        //svg.attr('transform', 'rotate(90, 0, 0)')
      }
    }, [domain]);


    return (
      <React.Fragment>
        {domain && domain.length && policyarea_selected && (
          <div className={classes.root}>
            <FormLabel component="legend" className={classes.label}>
              {policyarea_breadcrumb.replaceAll(">", "\n")}
            </FormLabel>
            <svg id="d3legend" width={210} height={125}></svg>
          </div>
        )}
      </React.Fragment>
    );
}
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { motion } from 'framer-motion';

const FactGraph = ({ data }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (!data || !data.length) return;

    // Process data to count ratings
    const ratingCounts = data.reduce((acc, claim) => {
      const rating = claim.claimReview?.[0]?.textualRating || 'Unrated';
      acc[rating] = (acc[rating] || 0) + 1;
      return acc;
    }, {});

    // Convert to array format for D3
    const chartData = Object.entries(ratingCounts).map(([rating, count]) => ({
      rating,
      count
    }));

    // Clear previous content
    d3.select(svgRef.current).selectAll('*').remove();

    // Set up dimensions
    const margin = { top: 20, right: 30, bottom: 60, left: 40 };
    const width = 600;
    const height = 400;
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Create SVG
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    // Create scales
    const x = d3.scaleBand()
      .domain(chartData.map(d => d.rating))
      .range([margin.left, width - margin.right])
      .padding(0.3);

    const y = d3.scaleLinear()
      .domain([0, d3.max(chartData, d => d.count)])
      .nice()
      .range([height - margin.bottom, margin.top]);

    // Create container group
    const g = svg.append('g');

    // Add bars
    g.selectAll('rect')
      .data(chartData)
      .join('rect')
      .attr('x', d => x(d.rating))
      .attr('y', height - margin.bottom)
      .attr('width', x.bandwidth())
      .attr('fill', '#4f46e5')
      .transition()
      .duration(1000)
      .attr('y', d => y(d.count))
      .attr('height', d => height - margin.bottom - y(d.count));

    // Add x-axis
    svg.append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .attr('transform', 'rotate(-45)')
      .style('text-anchor', 'end')
      .attr('dx', '-.8em')
      .attr('dy', '.15em');

    // Add y-axis
    svg.append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).ticks(5));

    // Add labels
    svg.append('text')
      .attr('class', 'y-axis-label')
      .attr('transform', 'rotate(-90)')
      .attr('y', margin.left - 30)
      .attr('x', -(height / 2))
      .attr('text-anchor', 'middle')
      .text('Number of Claims');

    // Add value labels on top of bars
    g.selectAll('.value-label')
      .data(chartData)
      .join('text')
      .attr('class', 'value-label')
      .attr('x', d => x(d.rating) + x.bandwidth() / 2)
      .attr('y', d => y(d.count) - 5)
      .attr('text-anchor', 'middle')
      .text(d => d.count)
      .style('opacity', 0)
      .transition()
      .duration(1000)
      .style('opacity', 1);

  }, [data]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full overflow-x-auto"
    >
      <svg ref={svgRef} style={{ minWidth: '600px', width: '100%' }} />
    </motion.div>
  );
};

export default FactGraph;
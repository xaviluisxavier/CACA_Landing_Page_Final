import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

export default function ChartOportunidades() {
    const svgRef = useRef(null);
    const containerRef = useRef(null);

    const dados = [
        { ano: "2015", valor: 10 }, { ano: "2016", valor: 20 },
        { ano: "2017", valor: 35 }, { ano: "2018", valor: 50 },
        { ano: "2019", valor: 45 }, { ano: "2020", valor: 70 },
        { ano: "2021", valor: 85 }, { ano: "2022", valor: 90 },
        { ano: "2023", valor: 100 }
    ];

    // Cálculos para as estatísticas
    const total = dados.reduce((acc, atual) => acc + atual.valor, 0);
    const anosAltaProcura = dados.filter(d => d.valor > 50).map(d => d.ano).join(', ');

    useEffect(() => {
        if (!svgRef.current || !containerRef.current) return;

        const container = containerRef.current;
        const grafico = d3.select(svgRef.current);
        
        // Limpar antes de desenhar
        grafico.selectAll("*").remove();

        const margin = { top: 20, right: 20, bottom: 50, left: 40 };
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight || 340;
        
        const innerWidth = containerWidth - margin.left - margin.right;
        const innerHeight = containerHeight - margin.top - margin.bottom;

        grafico.attr("width", containerWidth).attr("height", containerHeight);

        // Criar Grupos
        const defs = grafico.append('defs');
        const grupoGrid = grafico.append('g').attr("transform", `translate(${margin.left},${margin.top})`);
        const grupoCorpo = grafico.append('g').attr("transform", `translate(${margin.left},${margin.top})`);
        const grupoEixoX = grafico.append('g').attr("transform", `translate(${margin.left},${innerHeight + margin.top})`);

        // Escalas
        const xScale = d3.scaleBand().domain(dados.map(d => d.ano)).range([0, innerWidth]).padding(0.4);
        const yScale = d3.scaleLinear().domain([0, d3.max(dados, d => d.valor) * 1.1]).range([innerHeight, 0]);

        // Gradiente
        const gradient = defs.append("linearGradient").attr("id", "bar-gradient").attr("x1", "0%").attr("y1", "0%").attr("x2", "0%").attr("y2", "100%");
        gradient.append("stop").attr("offset", "0%").attr("stop-color", "var(--color-primary, #003882)");
        gradient.append("stop").attr("offset", "100%").attr("stop-color", "#3CA1FF");

        // Grelha e Eixos
        grupoGrid.call(d3.axisLeft(yScale).ticks(5).tickSize(-innerWidth).tickFormat(d => d));
        grupoGrid.select(".domain").remove(); 
        grupoGrid.selectAll(".tick line").attr("stroke", "rgba(0,0,0,0.06)").attr("stroke-dasharray", "4,4");
        
        grupoEixoX.call(d3.axisBottom(xScale));
        grupoEixoX.select(".domain").attr("stroke", "rgba(0,0,0,0.1)").attr("stroke-width", 2);
        grupoEixoX.selectAll(".tick line").remove();
        grupoEixoX.selectAll(".tick text").attr("fill", "var(--color-dark-gray)").attr("font-size", "13px").attr("font-weight", "700").attr("dy", "1.2em");

        // Tooltip nativo
        let tooltip = d3.select("body").select(".chart-tooltip");
        if (tooltip.empty()) {
            tooltip = d3.select("body").append("div")
                .attr("class", "chart-tooltip")
                .style("opacity", 0)
                .style("position", "absolute")
                .style("background", "rgba(0, 56, 130, 0.95)")
                .style("color", "#fff")
                .style("padding", "10px 14px")
                .style("border-radius", "6px")
                .style("pointer-events", "none")
                .style("z-index", "1000");
        }

        // Barras Animadas
        grupoCorpo.selectAll("rect")
            .data(dados)
            .enter().append("rect")
            .attr("x", d => xScale(d.ano))
            .attr("width", xScale.bandwidth())
            .attr("fill", "url(#bar-gradient)") 
            .attr("rx", 6).attr("ry", 6)
            .style("cursor", "pointer")
            .on("mouseover", function(event, d) {
                d3.select(this).transition().duration(200).attr("opacity", 0.85);
                tooltip.transition().duration(200).style("opacity", 1);
                tooltip.html(`<strong>${d.ano}</strong><br/>${d.valor} Oportunidades`)
                       .style("left", (event.pageX + 15) + "px")
                       .style("top", (event.pageY - 40) + "px");
            })
            .on("mouseout", function() {
                d3.select(this).transition().duration(300).attr("opacity", 1);
                tooltip.transition().duration(300).style("opacity", 0);
            })
            .attr("y", innerHeight)
            .attr("height", 0)
            .transition()
            .duration(800)
            .delay((d, i) => i * 100)
            .attr("y", d => yScale(d.valor))
            .attr("height", d => innerHeight - yScale(d.valor));

        return () => {
            d3.select("body").select(".chart-tooltip").remove();
        };
    }, []); 


    return (
        <div id="grafico" style={{ marginTop: '3rem' }}>
            <div id="estatisticas-grafico">
                <p className="grafico-estatisticas-texto">
                    Foram geradas <strong className="stat-total">{total}</strong> oportunidades no total. <br />
                    Anos de maior sucesso: <span className="stat-anos">{anosAltaProcura}</span>.
                </p>
            </div>
            
            <div className="grafico-placeholder" ref={containerRef} style={{ height: '340px', width: '100%', position: 'relative' }}>
                <svg id="opportunityChart" ref={svgRef} style={{ width: '100%', height: '100%' }}></svg>
            </div>
        </div>
    );
}

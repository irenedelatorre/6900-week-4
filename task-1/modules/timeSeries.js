//everything has to be in the wrapper (a function)

d3.timeSeries = function (){

    //Wrapper function
    //internal variables. Will need some default values that can be overwritten later
    var w = 800,
        h = 600,
        m = {t:50,r:25,b:50,l:25},

    //area of the chart
        chartW = w - m.l - m.r,
        chartH = h - m.t - m.b,
        timeRange = [new Date(), new Date()],//timeRange = [start, end],
        binSize = d3.time.day,
        valueAccessor = function (d){return d},
        maxY = function (d){return d.length},
        layout = d3.layout.histogram();

    //SCALES
    var scaleX = d3.time.scale().domain(timeRange).range([0,chartW]),
        scaleY = d3.scale.linear().domain([0,maxY]).range([chartH,0]);

    //function (selection). Exports. the function that gets exported, returned. transform data and appends elements
    function exports (selection) {
        //take the data, use a histogram layout to transform into a series of (x,y)
        //"selection" ---> d3.select("plot")
        //d3.time.interval.range(date1,date2);
        var bins = binSize.range(timeRange[0],timeRange[1]);
        bins.unshift(timeRange[0]);
        bins.push(timeRange[1]);

        layout
            .range(timeRange)
            .bins(bins);

        chartW = w - m.l - m.r;
        chartH = h - m.t - m.b;

        scaleX.range([0,chartW]).domain(timeRange);
        scaleY.range([chartH,0]).domain([0,maxY]);

//draw the (x,y) as a line and an are
        selection.each(function (d) {
            console.log("start drawing");
            //console.log("initial data in timeseries", d);

            var data = layout(d);
            //console.log("data", data);

            // take the data, use a histogram layout to transform into a series of (x,y)
            layout
                .value(valueAccessor) //d transformed by the histogram layout
                .range(timeRange)
                .bins(binSize.range(timeRange[0],timeRange[1]));

            //generators
            var lineGenerator = d3.svg.line()
                .x(function (d){
                    return scaleX(d.x.getTime() + d.dx/2)}) //getTime transform the data into a time value
                .y(function (d){return scaleY(d.y)})
                .interpolate('basis');

            var areaGenerator = d3.svg.area()
                .x(function (d){
                    return scaleX(d.x.getTime() + d.dx/2)}) //getTime transform the data into a time value
                .y0(chartH)
                .y1(function (d){return scaleY(d.y)})
                .interpolate('basis');

            var axisX = d3.svg.axis()
                .orient('bottom')
                .scale(scaleX)
                .ticks(d3.time.year);

            var graph = d3.select(this).selectAll("svg").data([d]);
            var graphEnter = graph.enter().append("svg");
            graph.attr('width',w).attr('height',h);

            //LINE
            graphEnter.append("g")
                .attr("class","line")
                .attr("transform","translate ("+ m.l +","+ m.t+")")
                .append("path")
                .datum(data)
                .attr("d", lineGenerator);
            //AREA
            graphEnter.append("g")
                .attr("class","area")
                .attr("transform","translate ("+ m.l +","+ m.t+")")
                .append("path")
                .datum(data)
                .attr("d", areaGenerator);

            // axis
            graphEnter.append("g")
                .attr("class","axis")
                .attr("transform","translate ("+ m.l +","+(m.t+chartH)+")")
                .call(axisX);

        });
    }

    //getter and setter functions. access the internal variables at the very top
    exports.width =  function (_x){ // _ --> convention to indicate that this is an info that puts the user
        if (!arguments.length) return w;//if the user puts no argument
        w = _x;
        return this; // return exports
    };
    exports.height = function (_x){ //x is a placeholder, is not the same _x of exports.width
        if (!arguments.length) return h;
        h = _x;
        return this
    };
    exports.timeRange = function(_r){
        if (!arguments.length) return timeRange;
        timeRange = _r;
        return this
    };
    exports.binSize = function(interval){
        if (!arguments.length) return binSize;
        binSize = interval;
        return this
    };
    exports.value = function(accessor){
        if(!arguments.length) return layout.value();
        valueAccessor = accessor;
        layout.value(accessor);
        return this;
    };

    exports.maxY = function (_d){
        if (!arguments.length) return maxY;
        maxY = _d;
        return this
    };


    //return function
    return exports
};

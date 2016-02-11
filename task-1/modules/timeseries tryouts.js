//everything has to be in the wrapper (a function)

d3.timeSeries = function (){

    //Wrapper function

    //internal variables. Will need some default values that can be overwritten later
    var w = 800,
        h = 600,
        m = {t:25,r:50,b:25,l:25},
    //area of the chart
        chartW = w - m.l - m.r,
        chartH = h - m.t - m.b,
        timeRange = [new Date(), new Date()],//timeRange = [start, end],
        binSize,
        valueAccessor = function (d){return d.startTime},
        maxY = function (d){return d.length};

    //SCALES
    var scaleX = d3.scale.linear().domain(timeRange).range([0,chartW]),
        scaleY = d3.scale.linear().domain(maxY).range([chartH,0]);

    //function (selection). Exports. the function that gets exported, returned. transform data and appends elements
    function exports (selection) {

        // take the data, use a histogram layout to transform into a series of (x,y)
        var layout = d3.layout.histogram()
            .value(valueAccessor)
            .range(timeRange)
            .bins(binSize.range(timeRange[0],timeRange[1])); //d3.time.interval.range(date1,date2)

        //take the data, use a histogram layout to transform into a series of (x,y)
        selection.each(function(_d){ //_d is an argument, can be anything
            //"selection" ---> d3.select("plot")
            var data = layout(_d);
            console.log(data);

            var svg = d3.select(this).append("svg");
            var graph = svg.append("g").attr("transform","translate ("+ m.l +","+ m.t+")");

            //LINE
            var lineGenerator = d3.svg.line()
                .x(function (d){return scaleX(d.startTime)})
                .y(function (d){return scaleY(d.duration)});

            graph.append("path")
                .attr("d", function(d){return lineGenerator(data)});
        });

        //draw the (x,y) as a line and an are

        //axis
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
        if (!arguments.length) return accessor;
        valueAccessor = accessor;
        return this
    };
    exports.maxY = function (_d){
        if (!arguments.length) return maxY;
        maxY = _d;
        return this
    };



    //return function
    return exports
}/**
 * Created by Irene on 09-Feb-16.
 */

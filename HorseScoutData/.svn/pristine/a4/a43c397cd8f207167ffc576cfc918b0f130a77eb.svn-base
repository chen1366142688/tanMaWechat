/*我也要试试页面分享备份代码*/
$(function(){
    let childrenId = GetQueryString("childrenId");
    let height = GetQueryString("height");
    let token = GetQueryString("token");
    let resultObj = {};
    let codes = ['CHILDREN_SCORE_SHARE']
    dimensionalData(childrenId,height);
    childInfomation(codes);
    var myChart = echarts.init(document.getElementById('main'));
    var myChart2 = echarts.init(document.getElementById('main2'));
    function dimensionalData(childrenId,height){
        $.ajax({
            type: 'GET',
            url: appurl +"/v1/corporeityTest/getTestAgeResult",
            headers: {
                'token':token
            },
            data: {
                childrenId:childrenId,
                height:height
            },
            contentType: "application/json",
            success (res) {
                if (res.code == '10000') {
                    let result = res.response;
                    let array = new Array();
                    let array1 = new Array();
                    let array2 = new Array();
                    $('.sore').text(result.score);
                    $('.Proportion').text(result.percent+'%');
                    for (let i = 0; i < result.peopleNumList.length; i++) {
                        if (i == result.score) {
                            array1.push(result.peopleNumList[i]);
                            array2.push(result.peopleNumList[i]);
                            array.push(i)
                            continue;
                        }
                        if (i % 10 == 0) {
                            array1.push(result.peopleNumList[i]);
                            array2.push(0);
                            array.push(i)
                        }
                    }
                    myChart.setOption(getBarOption(result.keyList));
                    myChart2.setOption(getScaOption(array,array1,array2));
                }else{
                    confirm(res.msg)
                }
            },
            error (data) {
                confirm(data.msg)
            }
        })
    }
    //点击我也要试试去下载页面
    $('.bootBtn').click(function(){
        window.location.href = H5url+'/downLoad.html';
    })
    function childInfomation(codes){
        $.ajax({
            type:'POST',
            url: appurl +"/v1/help/get/commonInformation",
            data: JSON.stringify({
                codes:codes
            }),
            contentType: "application/json",
            success(res){
                if(res.code == 10000){
                    $('.describe').text(res.response[0].comtent)
                }else{
                    confirm(res.msg)
                }
            },
            error(info){
                console.log("请求失败");
                confirm(info.msg)
            }
        })
    }
    function getBarOption(keyList){
        var option = {
            backgroundColor: '#fff',
            radar: [
                {
                    indicator: [],
                    center: ['50%', '50%'],
                    radius: '80%',
                    startAngle: 10,
                    splitNumber: 10,
                    shape: 'circle',
                    name: {
                        textStyle: {
                            color: '#666',
                            fontSize: 14
                        }
                    },
                    splitArea: {
                        areaStyle: {
                            color: ['rgba(0, 0, 0, 0)']
                        }
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#E6E6E6'
                        }
                    },
                    splitLine: {
                        lineStyle: {
                            color: '#E6E6E6'
                        }
                    }
                }
            ],
            series: [
                {
                    name: '体质统计',
                    type: 'radar',
                    data: [
                        {
                            value: [],
                            name: '图1',
                            symbol: 'circle',
                            itemStyle: {
                                color: '#FDC54A'
                            },
                            lineStyle: {
                                width: 1,
                                color: '#FDC54A'
                            },
                            label: {
                                show: true,
                                color: '#FDC54A',
                                fontWeight:'bold',
                                fontSize:13,
                                position: 'insideBottom',
                                distance:5,
                                rich: {
                                    a: {
                                        color: '#fff'
                                    }
                                }
                            },
                            areaStyle: {
                                normal: {
                                    color: '#FDC54A',
                                    opacity: 0.25
                                }
                            }
                        }
                    ]
                }
            ]
        };
        if (keyList.length>1){
            for (var i = 0, seriesArray = [], objArry = []; i < keyList.length; i++) {
                objArry.push({ "text": keyList[i].name, "max": 10 })
                seriesArray.push(keyList[i].pointValue.toFixed(1))
            }
            option.radar[0].indicator = objArry;
            option.series[0].data[0].value = seriesArray;
        }else{
            option.radar[0].indicator = [
                { text: '力量', max: 10 },
                { text: '速度', max: 10 },
                { text: '耐力', max: 10 },
                { text: '柔韧', max: 10 },
                { text: '协调', max: 10 }
            ];
            option.series[0].data[0].value = [0, 0, 0, 0, 0];
        }

        return option;
    }
    function getScaOption(array,array1,array2){
        var option = {
            title: {
                text: '分值0-100分',
                textStyle: {
                    color: '#666',
                    fontSize: 13,
                    fontWeight: 'normal'
                },
                right: '4%',
                top: 8
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '2%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                data: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
            },
            yAxis: {
                type: 'value',
                name: '分值总人数',
                nameGap: 35,
                nameTextStyle: {
                    color: '#666',
                    fontSize: 13
                },
                splitNumber: 2,
                splitLine: {
                    lineStyle: {
                        color: '#e2e2e2',
                        type: 'solid'
                    }
                },
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false
                }
            },
            series: [
                {
                    data: [],
                    type: 'line',
                    showSymbol: false,
                    symbolSize: 2,
                    smooth: true,
                    itemStyle: {
                        normal: {
                            color: "#F882B6"
                        },
                    },
                    lineStyle: {
                        width: 1
                    },
                    areaStyle: {
                        normal: {
                            color: '#F882B6',
                            opacity: 0.3
                        }
                    },
                },
                {
                    type: 'bar',
                    barWidth: '2',
                    itemStyle: {
                        normal: {
                            color: "#fff"
                        },
                    },
                    data: [],
                    markPoint: {
                        symbol: 'roundRect',
                        symbolSize: [60, 20],
                        symbolOffset: [16, -20],
                        label: {
                            formatter: function (param) {
                                return '我在这里';
                            }
                        },
                        itemStyle: {
                            color: '#5cd3c9'
                        },
                        data: [{
                            name: '最大值',
                            type: 'max'
                        }]
                    }
                }
            ]
        };
        if (array.length>1){
            option.series[0].data = array1;
            option.series[1].data = array2;
            option.xAxis.data = array;
        }else{
            option.series[0].data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            option.series[1].data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            option.xAxis.data = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
        }
        return option;
    }



});
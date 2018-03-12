$(function() {
    var ctx = document.getElementById('profilepostChart').getContext('2d');
    var chart = new Chart(ctx, {
        // The type of chart we want to create
        type: 'line',

        // The data for our dataset
        data: {
            labels: ["იანვარი", "თებერვალი", "მარტი", "აპრილი", "მაისი", "ივნისი", "ივლისი", "აგვისტო", "სექტემბერი", "ოქტომბერი", "ნოემბერი", "დეკემბერი"],
            datasets: [{
                label: "სტატია",
                backgroundColor: 'rgb(23, 162, 184)',
                borderColor: 'rgb(19, 134, 152)',
                data: [0, 10, 5, 2, 20, 30, 45,56,85,12,34,20],
            }]
        },

        // Configuration options go here
        options: {
            legend: {
                display: false
            },
            scales: {
                yAxes:[{
                    display: false,
                    stacked:true,
                  gridLines: {
                      display:false,
                    color:"rgba(255,99,132,0.2)"
                  },
                  ticks:{
                      reverse:true,
                      scaleLabel:function(f){
                          return '';
                      }
                  }
              }],
              xAxes:[{
                      display: false,
                      gridLines: {
                      display:false
                  }
              }]
            }
        }
    });




    var ctx = document.getElementById('profiledonationChart').getContext('2d');
    var chart = new Chart(ctx, {
        // The type of chart we want to create
        type: 'bar',

        // The data for our dataset
        data: {
            labels: ["იანვარი", "თებერვალი", "მარტი", "აპრილი", "მაისი", "ივნისი", "ივლისი", "აგვისტო", "სექტემბერი", "ოქტომბერი", "ნოემბერი", "დეკემბერი"],
            datasets: [{
                label: "ჩარიცხვა",
                backgroundColor: 'rgb(255, 193, 7)',
                borderColor: 'rgb(255, 193, 7)',
                data: [0, 10, 5, 2, 20, 30, 45,56,85,12,34,20],
            }]
        },

        // Configuration options go here
        options: {
            legend: {
                display: false
            },
            scales: {
                yAxes:[{
                    display: false,
                    stacked:true,
                  gridLines: {
                      display:false,
                    color:"rgba(255,99,132,0.2)"
                  },
                  ticks:{
                      reverse:false,
                      scaleLabel:function(f){
                          return '';
                      }
                  }
              }],
              xAxes:[{
                      display: false,
                      gridLines: {
                      display:false
                  }
              }]
            }
        }
    });


    var ctx = document.getElementById('profileusersChart').getContext('2d');
    var chart = new Chart(ctx, {
        // The type of chart we want to create
        type: 'radar',

        // The data for our dataset
        data: {
            labels: ["იანვარი", "თებერვალი", "მარტი", "აპრილი", "მაისი", "ივნისი", "ივლისი", "აგვისტო", "სექტემბერი", "ოქტომბერი", "ნოემბერი", "დეკემბერი"],
            datasets: [{
                label: "მომხმარებელი",
                backgroundColor: 'rgb(40, 167, 69)',
                borderColor: 'rgb(32, 127, 54)',
                data: [0, 10, 5, 2, 20, 30, 45,56,85,12,34,20],
            }]
        },

        // Configuration options go here
        options: {
            legend: {
                display: false
            },
            scales: {
                yAxes:[{
                    display: false,
                    stacked:true,
                  gridLines: {
                      display:false,
                    color:"rgba(255,99,132,0.2)"
                  },
                  ticks:{
                      reverse:false,
                      scaleLabel:function(f){
                          return '';
                      }
                  }
              }],
              xAxes:[{
                      display: false,
                      gridLines: {
                      display:false
                  }
              }]
            }
        }
    })
});
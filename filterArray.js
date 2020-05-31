data = [{
    Name: 'jhon',
    Age: '21',
    Course: [{
            Name: 'course js',
            Paid: 100000,
            subCourse: [{
                    Episode: 1,
                    Desc: 'introduction',
                },
                {
                    Episode: 2,
                    Desc: 'array',
                }
            ]
        },
        {
            Name: 'course php',
            subCourse: [{
                    Episode: 1,
                    Desc: 'introduction',
                },
                {
                    Episode: 2,
                    Desc: 'array',
                }
            ]
        }
    ]
},
{
    Name: 'doe',
    Age: '20',
    Course: [{
            Name: 'course graphql',
            Paid: 150000,
            subCourse: [{
                    Episode: 1,
                    Desc: 'introduction',
                },
                {
                    Episode: 2,
                    Desc: 'array',
                }
            ]
        },
        {
            Name: 'course python',
            subCourse: [{
                    Episode: 1,
                    Desc: 'introduction',
                },
                {
                    Episode: 2,
                    Desc: 'array',
                }
            ]
        }
    ]
}
]

// const filterData = data => minAge => EpisodeCount => data.reduce((acc,curr)=>+curr.Age>minAge?[...acc, curr.Course.filter(d=>d.Paid && d.subCourse.filter(sc=>sc.Episode===EpisodeCount))[0]]:acc,[])
 

function filterData(data, minAge, EpisodeCount) {
    return data.reduce((acc, curr) => (+curr.Age > minAge ? [...acc, curr.Course.filter((d) => d.Paid && d.subCourse.filter((sc) => sc.Episode === EpisodeCount))[0]] : acc), []);
}


console.log(JSON.stringify(filterData(data,20,2)));


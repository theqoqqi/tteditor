
const markerMeshStyles = {
    landmark: {
        area: {
            '--color1': 'rgba(255, 64, 0, 0.1)',
            '--color2': 'rgba(255, 64, 0, 0.2)',
            border: '2px solid darkred',
        },
    },
    structure: {
        area: {
            '--color1': 'rgba(192, 192, 192, 0.25)',
            '--color2': 'rgba(192, 192, 192, 0.5)',
            border: '2px solid gray',
        },
    },
    building: {
        area: {
            '--color1': 'rgba(255, 192, 0, 0.15)',
            '--color2': 'rgba(255, 192, 0, 0.4)',
            border: '2px solid orange',
        },
    },
    waypoint: {
        icon: {
            color: 'white',
            backgroundColor: 'red',
            border: '2px solid black',
        },
        area: {
            backgroundColor: 'rgba(255, 192, 0, 0.1)',
            border: '2px solid orange',
        },
    },
    magic: {
        icon: {
            color: 'white',
            backgroundColor: 'purple',
            border: '1px solid black',
        },
        area: {
            backgroundColor: 'rgba(0, 153, 255, 0.1)',
            border: '2px solid mediumpurple',
        },
    },
    ambient: {
        icon: {
            color: 'white',
            backgroundColor: 'dodgerblue',
            border: '1px solid black',
        },
    },
};

export default markerMeshStyles;
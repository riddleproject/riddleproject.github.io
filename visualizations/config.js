var config = {
    style: 'mapbox://styles/ndrezn/ck3jkuzqe05uu1cmidl0er2h7',
    accessToken: 'pk.eyJ1IjoibmRyZXpuIiwiYSI6ImNqeXg2eDlhZzA0MzczZ28xeDdzNnNqY3kifQ.lxS44L-xGMpt-Wcv0vpHng',
    showMarkers: true,
    theme: 'light',
    alignment: 'left',
    title: 'Patterns in Riddle Events',
    subtitle: '',
    byline: 'The Riddle Project',
    footer: '',
    chapters: [
        {
            id: 'intro',
            title: 'Worldwide spread',
            image: '',
            description: 'Riddles were published all over the world',
            location: {
                center: [-59.42113, 44.67741],
                zoom: 1.36,
                pitch: 0,
                bearing: 0
            },
            onChapterEnter: [
                // {
                //     layer: 'layer-name',
                //     opacity: 1
                // }
            ],
            onChapterExit: [
                // {
                //     layer: 'layer-name',
                //     opacity: 0
                // }
            ]
        },
        {
            id: 'british-riddles',
            title: 'British riddle events',
            image: '',
            description: 'These are all the riddles in England',
            location: {
                center: [-4.21847, 53.53475],
                zoom: 4.67,
                pitch: 44.00,
                bearing: -24.73
            },
            onChapterEnter: [
            ],
            onChapterExit: [
            ]
        },
        {
            id: 'bc-riddles',
            title: 'British Columbia riddles',
            image: '',
            description: 'These are all the riddles in BC',
            location: {
                center: [-121.40009, 51.94103],
                zoom: 4.75,
                pitch: 44.50,
                bearing: 34.47
            },
            onChapterEnter: [],
            onChapterExit: []
        }
    ]
};

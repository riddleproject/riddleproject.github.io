var config = {
    style: 'mapbox://styles/mapbox/light-v10',
    accessToken: 'YOUR_ACCESS_TOKEN',
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
            title: 'There are a lot of riddles!',
            image: '',
            description: 'Look at all of these riddles.',
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
            title: 'British Columbiariddles',
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

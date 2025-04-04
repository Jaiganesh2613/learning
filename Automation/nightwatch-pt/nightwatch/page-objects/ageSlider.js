module.exports = {
    elements: {
        ageSlider: 'div.mantine-Slider-root',
        ageMinInput: '#t1',
        ageMaxInput: '#t2',
        sliderThumbMin: {
            selector: 'div.mantine-Slider-thumb',
            index: 0
        },
        sliderThumbMax: {
            selector: 'div.mantine-Slider-thumb',
            index: 1
        }
    },
    commands: [{
        setAgeRange(minAge, maxAge) {
            return this
                .setValue('@ageMinInput', minAge)
                .setValue('@ageMaxInput', maxAge)
                .api.execute(function(min, max) {
                    const minSlider = document.querySelectorAll('div.mantine-Slider-thumb')[0];
                    const maxSlider = document.querySelectorAll('div.mantine-Slider-thumb')[1];

                    // You can add custom logic here to move the sliders
                    minSlider.style.left = (min - 18) / (99 - 18) * 100 + '%';
                    maxSlider.style.left = (max - 18) / (99 - 18) * 100 + '%';

                    minSlider.setAttribute('aria-valuenow', min);
                    maxSlider.setAttribute('aria-valuenow', max);
                }, [minAge, maxAge]);
        }
    }]
};

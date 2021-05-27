import React from 'react';
import ReactDom from 'react-dom';
import '@testing-library/jest-dom';

import Map from '../Map';

it('<Map/> renders without crashing', () => {
    const div = document.createElement('div');
    ReactDom.render(<Map></Map>, div);
})
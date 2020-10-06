import React from 'react'
import './RangeSlider.css'

export function RangeSlider() {
    return (
        <div className="rangeslider-container">
            <input type="range" min="1" max="5" />
        </div>
    )
}
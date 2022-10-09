import React, {useState} from 'react'
import './App.css'
import DropFile from './Components/Dropfile/DropFile'
import {ExternalFile} from './Libs/Files/files'
import ContextMenu from './Components/ContextMenu/ContextMenu'
import ImagesView from './Components/ImagesView/ImagesView'
import ImagePopup from './Components/ImagePopup/ImagePopup'


function App() {
  const [image, setImage] = useState<ExternalFile[]>([])
  const [colCount, setColCount] = useState(4)
  const [gap, setGap] = useState(0)

  return (
    <div className="App">
      <ContextMenu/>
      <ImagePopup/>
      <input type="range" min={1} max={10} onChange={item => setColCount(parseFloat(item.target.value))}
             value={colCount}/>
      <input type="range" min={0} max={40} onChange={item => setGap(parseFloat(item.target.value))} value={gap}/>
      <ImagesView colCount={colCount} gap={gap} images={image}/>
      <DropFile onDropFiles={data => setImage(data)}></DropFile>
    </div>
  )
}

export default App

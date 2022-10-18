import React, {useEffect, useRef, useState} from 'react'
import './App.css'
import DropFile from './Components/Dropfile/DropFile'
import {ExternalFile} from '@Libs/Files'
import ContextMenu from './Components/ContextMenu/ContextMenu'
import ImagePopup from './Components/ImagePopup/ImagePopup'
import {ZenGrid} from '@Libs/Canvas/Components'
import ImagesGrid from '@Components/ImagesGrid/ImagesGrid'

function App() {
  const [image, setImage] = useState<ExternalFile[]>([])
  const {current: grid} = useRef(new ZenGrid())

  useEffect(() => {
    grid.setImages(image)
  }, [grid, image])

  return (
    <div className="App">
      <ContextMenu/>
      <ImagePopup/>
      <ImagesGrid grid={grid}/>
      <DropFile onDropFiles={data => setImage(data)}></DropFile>
    </div>
  )
}

export default App

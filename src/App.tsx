import React, {useState} from 'react'
import './App.css'
import DropFile from './Components/Dropfile/DropFile'
import {ExternalFile} from '@Libs/Files'
import ContextMenu from './Components/ContextMenu/ContextMenu'
import ImagesView from './Components/ImagesView/ImagesView'
import ImagePopup from './Components/ImagePopup/ImagePopup'
import Range from './Components/Range/Range'
import {ZenGridOptions} from '@Components/ImagesView/Components'


function App() {
  const [image, setImage] = useState<ExternalFile[]>([])
  const [gridOptions, setGridOptions] = useState<ZenGridOptions>({gap: 0, colCount: 4})

  return (
    <div className="App">
      <ContextMenu/>
      <ImagePopup/>
      <Range value={gridOptions.colCount} min={1} max={10}
             setValue={(value) => setGridOptions({...gridOptions, colCount: value})}
             text={'Количество колонок'}/>
      <ImagesView gridOptions={gridOptions} images={image}/>
      <DropFile onDropFiles={data => setImage(data)}></DropFile>
    </div>
  )
}

export default App

import React, {ReactNode, useEffect, useState} from 'react'
import './App.css'
import DropFile from './components/Dropfile/DropFile'
import {BlobFile} from './libs/files'
import Grid from './components/Grid/Grid'
import GridImage from './components/GridImage/GridImage'


function App() {
  const [image, setImage] = useState<BlobFile[]>([])
  const [images, setImages] = useState<ReactNode[]>([])
  const [colCount, setColCount] = useState(4)

  useEffect(() => {
    const asyncs: Promise<string>[] = []

    image.forEach(async (item, index) => {
      asyncs.push(item.loadImage())
    })

    Promise.all(asyncs)
      .then(strings => strings.map(item => <GridImage src={item}/>))
      .then(img => setImages([...images, ...img]))
  }, [image])

  return (
    <div className="App" >
      <input type="range" min={0} max={10} onChange={item => setColCount(parseFloat(item.target.value))}/>
      <DropFile onDropFiles={data => setImage(data)}></DropFile>
      <Grid colCount={colCount}>{images}</Grid>
    </div>
  );
}

export default App;

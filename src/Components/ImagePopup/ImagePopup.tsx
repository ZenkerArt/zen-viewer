import React from 'react'
import styles from './ImagePopup.module.scss'
import clsx from 'clsx'
import {observer} from 'mobx-react'
import {imagePopupStore} from '@StoreIndex'
import {Vector2} from '@Libs/Math'
import ZenCanvas from '@Components/ZenCanvas/ZenCanvas'
import {ZenImageViewer} from '@Libs/Canvas/Components'
import {Animations} from '@Libs/Canvas/Components/ZenImageViewer'
import MatIcon from '@Components/MatIcon/MatIcon'
import {MatIconCode} from '@Components/MatIcon/MatIconCode'

interface ImagePopupState {
  pos: Vector2
  size: Vector2
}

@observer
class ImagePopup extends React.Component<any, ImagePopupState> {
  image?: React.RefObject<HTMLImageElement> = React.createRef()
  element?: React.RefObject<HTMLImageElement> = React.createRef()
  component: ZenImageViewer = new ZenImageViewer()

  componentDidUpdate(prevProps: Readonly<any>, prevState: Readonly<ImagePopupState>, snapshot?: any) {
    console.log(imagePopupStore.url)
    this.component.setImage(imagePopupStore.url)
    imagePopupStore.onNext = (image, dir) =>
      this.component.setImage(image, dir ? Animations.right : Animations.left)
  }

  render() {

    return (<div
      className={clsx(styles.imageViewer, {[styles.show]: imagePopupStore.isShow})}
      ref={this.element}
      onTransitionEnd={() => imagePopupStore.removeAllImages()}
    >
      <ZenCanvas component={this.component} style={{height: '100vh'}}/>

      <div className={styles.prev} onClick={() => imagePopupStore.prev()}>
        <MatIcon icon={MatIconCode.arrowBackIos} className={styles.icon}/>
      </div>
      <div onClick={() => imagePopupStore.next()} className={styles.next}>
        <MatIcon icon={MatIconCode.arrowForwardIos} className={styles.icon}/>
      </div>
    </div>)
  }
}

export default ImagePopup

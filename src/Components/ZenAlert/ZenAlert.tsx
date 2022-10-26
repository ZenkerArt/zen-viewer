import React, {useEffect, useState} from 'react'
import styles from './ZenAlert.module.scss'
import clsx from 'clsx'
import MatIcon from '@Components/MatIcon/MatIcon'
import {observer} from 'mobx-react'
import {alertStore} from '@StoreIndex'
import {AlertBase, AlertLoading, AlertNotify} from '@Store/AlertStore'

export type ZenAlertProps = {}
export type ZenAlertState = {}

function AlertComp({alert, className}: { alert: AlertNotify, className?: string }) {
  const s = alert.state ? styles.on : styles.off

  return <div className={clsx(styles.alert, className)}>
    <MatIcon icon={alert.icon} className={styles.icon}/>
    <div>{alert.text}</div>
    {
      alert.state !== undefined ?
        <div className={clsx(styles.state, s)}>{alert.state ? 'Включено' : 'Выключено'}</div> :
        <></>
    }
  </div>
}

function AlertLoadingComp({alert, className}: { alert: AlertLoading, className?: string }) {
  const [value, setValue] = useState(0)
  alert.onValue = setValue

  return <div className={clsx(styles.alert, className)}>
    <div className={styles.text}>{alert.value} / {alert.max}</div>
    <div className={styles.loading}>
      <div style={{
        width: `${(value / alert.max) * 100}%`
      }}></div>
    </div>
  </div>
}

function AlertSmart({alert}: { alert: AlertNotify | AlertLoading | AlertBase }) {
  if ('setMax' in alert) {
    return <AlertLoadingComp alert={alert}/>
  } else if ('text' in alert) return <AlertComp alert={alert}/>
  return <></>
}

function useTimer(func: () => void, t: number = 1000) {
  useEffect(() => {
    const timer = setTimeout(func, t);
    return () => clearTimeout(timer);
  }, []);
}

function Transition({alert}: { alert: AlertBase }) {
  const [isShow, setIsShow] = useState(false)

  useTimer(() => {
    setIsShow(true)
  }, 10)

  useTimer(() => {
    const d = alert.time ? setIsShow(false) : false
  }, alert.time)

  alert.onDestroy.removeFromDom = () => {
    setIsShow(false)
  }

  return <div
    className={clsx({[styles.show]: isShow}, styles.transition)}
    style={{
      overflow: 'hidden',
      boxSizing: 'border-box',
    }}
    onTransitionEnd={() => {
      if (!isShow) {
        alert.destroy()
      }
    }}
  >
    <AlertSmart alert={alert}/>
  </div>
}

@observer
class ZenAlert extends React.Component<ZenAlertProps, ZenAlertState> {
  render() {
    const {alerts} = alertStore

    return <div className={clsx(styles.zenAlert)}>
      {alerts.map((e, index) =>
        <div key={index}>
          <Transition alert={e}/>
        </div>
      )}
    </div>
  }
}

export default ZenAlert

import React from 'react';
import {MatIconCode} from "./MatIconCode";
import clsx from 'clsx'

type MatIconProps = {
  icon?: MatIconCode
  className?: string
}

function MatIcon(props: MatIconProps) {
  if (props.icon === undefined) {
    return <></>
  }

  return (
    <div className={clsx('material-icons', props.className)} style={{userSelect: 'none'}}>
      {props.icon}
    </div>
  );
}

export default MatIcon;

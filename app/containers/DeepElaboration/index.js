import React from 'react';
import ElaborationRow from '../ElaborationRow';

const DeepElaboration = props => {
  const { data, setElaboration } = props;

  const updateRow = (row, index) => {
    let newData = data.filter((d, di) => di === index).forEach(el => row);
    console.log('newData', newData);
    setElaboration(newData);
  };

  console.log('DeepElaboration', data);

  return (
    <>
      <div className="elaboration">
        <div className="row">
          <div className="column sm-col-12 xl-col-9">
            <div className="elaboration-title">Отправить эти запросы в глубокую проработку?</div>
          </div>
        </div>
      </div>
      <div className="cart-results __elaboration">
        <div className="elaboration-table">
          {data && data.length ? (
            data.map((r, ri) => (
              <ElaborationRow
                //
                key={ri}
                row={r}
                rowIndex={ri}
                updateRow={updateRow}
                className={'elaboration-list__item'}
              />
            ))
          ) : (
            <span>&nbsp;</span>
          )}
        </div>
      </div>
    </>
  );
};

export default DeepElaboration;

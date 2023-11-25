import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

/** Custom Hook */
import { useFetchQestion } from '../hooks/FetchQuestion';
import { updateResult } from '../hooks/setResult';

/** Assuming your data.js file exports an array of questions */
import questionsData from '../database/data.js';

export default function Questions({ onChecked }) {
  const [checked, setChecked] = useState(undefined);
  const { trace } = useSelector(state => state.questions);
  const result = useSelector(state => state.result.result);
  const dispatch = useDispatch();

  // Destructure only what you need from useFetchQestion
  const [{ isLoading, serverError }] = useFetchQestion();

  // Use questionsData instead of useSelector for demo purposes
  const questions = questionsData[trace];

  // Include dispatch in the dependency array of useEffect
  useEffect(() => {
    // Use functional update to get the latest state
    dispatch((dispatch) => {
      dispatch(updateResult({ trace, checked }));
    });
  }, [checked, trace, dispatch]);

  function onSelect(i) {
    onChecked(i);
    setChecked(i);
    // No need to dispatch here, useEffect will handle it
  }

  if (isLoading) return <h3 className='text-light'>isLoading</h3>;
  if (serverError) return <h3 className='text-light'> 1: ""</h3>;

  return (
    <div className='questions'>
      <h2 className='text-light'>{questions?.question}</h2>

      <ul key={questions?.id}>
        {
          questions?.options.map((q, i) => (
            <li key={i}>
              <input
                type="radio"
                value={i}
                name="options"
                id={`q${i}-option`}
                onChange={() => onSelect(i)}
              />

              <label className='text-primary' htmlFor={`q${i}-option`}>{q}</label>
              <div className={`check ${result[trace] === i ? 'checked' : ''}`}></div>
            </li>
          ))
        }
      </ul>
    </div>
  );
}

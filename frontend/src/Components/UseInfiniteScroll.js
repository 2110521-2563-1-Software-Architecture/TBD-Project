import { useState, useEffect } from 'react';

const useInfiniteScroll = (callback) => {
  const [isFetching, setIsFetching] = useState(false);
  const [isFinish,setIsFinish] = useState(false);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!isFetching) return;
    if (isFinish) {
      setIsFetching(false);
      console.log('you have all feed already');
      return;
    }
    callback(() => {
      console.log('called back');
    });
  }, [isFetching,isFinish]);

  function handleScroll() {
    const scrollBottom = window.pageYOffset + window.innerHeight;
    // console.log('scrollBottom:', scrollBottom);
    // console.log('scroll hieght:', document.documentElement.scrollHeight);
    if (document.documentElement.scrollHeight - scrollBottom < 1){
      setIsFetching(true);
    }
  }

  return [[isFetching, setIsFetching],[isFinish, setIsFinish]];
};

export default useInfiniteScroll;
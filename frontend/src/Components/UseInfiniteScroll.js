import { useState, useEffect } from 'react';

const useInfiniteScroll = (callback) => {
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!isFetching) return;
    callback(() => {
      console.log('called back');
    });
  }, [isFetching]);

  function handleScroll() {
    const scrollBottom = window.pageYOffset + window.innerHeight;
    // console.log('scrollBottom:', scrollBottom);
    // console.log('scroll hieght:', document.documentElement.scrollHeight);
    if (scrollBottom == document.documentElement.scrollHeight){
      setIsFetching(true);
      console.log('test 2');
    }
  }

  return [isFetching, setIsFetching];
};

export default useInfiniteScroll;
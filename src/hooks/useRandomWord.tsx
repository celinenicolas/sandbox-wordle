import { useEffect, useState } from 'react';

export const useRandomWord = (length:number = 5, language: string = "en") => {
  const [word, setWord] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getRandomWord();
  }, []);

  const getRandomWord = () => {
    setIsLoading(true);
    fetch('https://random-word-api.herokuapp.com/word?length=' +length + '&lang=' + language)
      .then((response) => response.json())
      .then((data) => {
            if (data && data.length > 0) {
                setWord(data[0]);
                setIsLoading(false);
            }
      });
  };

  return { word, isLoading, getRandomWord };
}

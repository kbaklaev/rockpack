import { useWillMount, useUssrEffect } from '@rockpack/ussr';
import { useSelector, useDispatch } from 'react-redux';
import { fetchImage } from './actions';
import { ImageState } from '../../types/Image';

const useImage = (): [boolean, boolean, string] => {
  const dispatch = useDispatch();
  const { url, error, loading } = useSelector<{
    image: ImageState;
  }, ImageState>((state) => state.image);

  const effect = useUssrEffect('image');
  useWillMount(effect, () => dispatch(fetchImage()));

  return [loading, error, url];
};

export default useImage;

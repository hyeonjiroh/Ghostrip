import { useParams } from 'react-router-dom';

export default function SpotDetail() {
  const { id } = useParams<{ id: string }>();

  return <div>Spot Detail - {id}</div>;
}

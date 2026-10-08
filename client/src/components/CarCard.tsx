import { Car, formatKm, formatPrice } from "../types";

interface Props {
  car: Car;
  onInterested: (car: Car) => void;
}

export default function CarCard({ car, onInterested }: Props) {
  return (
    <article className="car-card">
      <div className="car-image">
        {car.imagem_url ? <img src={car.imagem_url} alt={`${car.marca} ${car.modelo}`} loading="lazy" /> : <div className="placeholder" aria-label="Imagem do veículo indisponível">🚗</div>}
        {car.destaque && <span className="car-badge">Destaque</span>}
        <span className={`car-status ${car.status}`}>{car.status === "disponivel" ? "Disponível" : car.status === "reservado" ? "Reservado" : "Vendido"}</span>
      </div>
      <div className="car-body">
        <h3 className="car-title">{car.marca} {car.modelo}</h3>
        <div className="car-specs">
          <span>{car.ano}</span>
          {car.quilometragem !== null && <span>{formatKm(car.quilometragem)}</span>}
          {car.combustivel && <span>{car.combustivel}</span>}
          {car.cambio && <span>{car.cambio}</span>}
          {car.cor && <span>{car.cor}</span>}
        </div>
        {car.descricao && <p className="car-description">{car.descricao}</p>}
        <div className="car-price">{formatPrice(car.preco)}</div>
        <div className="car-actions">
          {car.status === "disponivel" ? <button className="btn btn-gold" onClick={() => onInterested(car)}>Tenho interesse</button> : <button className="btn btn-outline btn-unavailable" disabled>Indisponível</button>}
        </div>
      </div>
    </article>
  );
}

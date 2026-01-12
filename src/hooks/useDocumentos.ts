import { useQuery } from '@tanstack/react-query';
import { apiDocumentos } from '../api/ApiDocumentos';
import { apiToken } from '../api/ApiToken';
import { apiCotizaciones } from '../api/apiCotizaciones';
import type { DocumentosQueryParams } from '../types/DocumentosInterface';
import {apiPedidos} from '../api/apiPedidos';
import { apiOrdenes } from '../api/ApiOrdenes';
type TipoDocumento = 'facturas' | 'notas-devolucion' | 'pagos' | 'otros-documentos' |'pedidos'|'cotizaciones'| 'facturas-servicios';

export function useTiposOperacion() {
  return useQuery({
    queryKey: ['tipos-operacion'],
    queryFn: () => apiDocumentos.getTiposdeOperacion(),
    enabled: apiToken.isAuthenticated(),
    staleTime: 1000 * 60 * 60,
  });
}

export function useDocumentosBase(tipo: TipoDocumento) {
  const getSearchMethod = (tipoDoc: TipoDocumento) => {
    const methods = {
      'facturas': apiDocumentos.getFacturas.bind(apiDocumentos),
      'pagos': apiDocumentos.getPagos.bind(apiDocumentos),
      'notas-devolucion': apiDocumentos.getNotasDevolucion.bind(apiDocumentos),
      'otros-documentos': apiDocumentos.getOtrosDocumentos.bind(apiDocumentos),
      'facturas-servicios': apiDocumentos.getFacturasServicios.bind(apiDocumentos),
      'pedidos': apiPedidos.getPedidos.bind(apiPedidos),
      'cotizaciones': apiCotizaciones.getCotizaciones.bind(apiCotizaciones),
    };
    return methods[tipoDoc];
  };

  return useQuery({
    queryKey: ['documentos', tipo, 'base'],
    queryFn: async () => {
      const searchMethod = getSearchMethod(tipo);
      const queryParams: DocumentosQueryParams = {
        page: 1,
        size: 10,
        sort: 'fecha,DESC'
      };
      return searchMethod('', queryParams);
    },
    enabled: apiToken.isAuthenticated() && !apiToken.isAdmin(),
    staleTime: 1000 * 60 * 3, 
  });
}

export function useMapaMonedas() {
  return useQuery({
    queryKey: ['mapa-monedas'],
    queryFn: () => apiDocumentos.getMapaMonedas(),
    enabled: apiToken.isAuthenticated(),
    staleTime: 1000 * 60 * 60, 
  });
}


export function useCargosBase() {
  return useQuery({
    queryKey: ['cargos', 'base'],
    queryFn: async () => {
      const queryParams: DocumentosQueryParams = {
        page: 1,
        size: 10,
        sort: 'fecha,DESC'
      };
      return apiDocumentos.getCargos('', queryParams);
    },
    enabled: apiToken.isAuthenticated() && !apiToken.isAdmin(),
    staleTime: 1000 * 60 * 3, 
  });
}
export function useOrdenesBase() {
  return useQuery({
    queryKey: ['ordenes', 'base'],
    queryFn: async () => {
      return apiOrdenes.getOrdenes({ 
        page: 1, 
        size: 10, 
        sort: 'fechaCreacion,DESC' 
      });
    },
    enabled: apiToken.isAuthenticated() && !apiToken.isAdmin(),
    staleTime: 1000 * 60 * 1, 
  });
}
export function useCotizacionesBase() {
  return useQuery({
    queryKey: ['cotizaciones', 'base'],
    queryFn: async () => {
      const queryParams: DocumentosQueryParams = {
        page: 1,
        size: 10,
        sort: 'fecha,desc'
      };
      return apiCotizaciones.getCotizaciones('', queryParams);
    },
    enabled: apiToken.isAuthenticated() && !apiToken.isAdmin(),
    staleTime: 1000 * 60 * 3, 
  });
}

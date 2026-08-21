import { useQuery } from "@tanstack/react-query";
import { api } from "../services/api";

export function useModels() {
  return useQuery({ queryKey: ["models"], queryFn: api.models });
}

export function useProviders() {
  return useQuery({ queryKey: ["providers"], queryFn: api.providers });
}

export function useWallet() {
  return useQuery({ queryKey: ["wallet"], queryFn: api.wallet });
}

export function useJobs() {
  return useQuery({ queryKey: ["jobs"], queryFn: api.jobs, refetchInterval: 1500 });
}

export function useGallery() {
  return useQuery({ queryKey: ["gallery"], queryFn: api.gallery, refetchInterval: 3000 });
}

export function useDashboard() {
  return useQuery({ queryKey: ["dashboard"], queryFn: api.dashboard, refetchInterval: 3000 });
}

import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo } from "react";
import { useAlertStore } from "../stores/useAlertStore";
import { useSocket } from "./useSocket";

interface EntityChangeConfig {
  dependsOn?: string[];
  invalidate?: string[];
}

interface EntityChangeOptions {
  showNotifications?: boolean;
  entityLabel?: string;
  suppressSocketAlert?: boolean;
}

export function useEntityChangeSocket(
  entityName: string,
  config: EntityChangeConfig = {},
  options: EntityChangeOptions = {
    showNotifications: true,
    entityLabel: "",
    suppressSocketAlert: false,
  }
) {
  const socket = useSocket();
  const queryClient = useQueryClient();
  const { showAlert } = useAlertStore();

  // Memoize configuration to prevent unnecessary re-renders
  const memoizedConfig = useMemo(
    () => ({
      dependsOn: config.dependsOn || [],
      invalidate: config.invalidate || [],
    }),
    [config.dependsOn, config.invalidate]
  );

  // Memoize options to prevent unnecessary re-renders
  const memoizedOptions = useMemo(
    () => ({
      showNotifications: options.showNotifications ?? true,
      entityLabel: options.entityLabel || entityName,
      suppressSocketAlert: options.suppressSocketAlert || false,
    }),
    [
      options.showNotifications,
      options.entityLabel,
      entityName,
      options.suppressSocketAlert,
    ]
  );

  // Create memoized handler functions to reduce re-renders
  const handleInvalidateQueries = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: [entityName] });

    // Invalidate related entities
    if (memoizedConfig.invalidate.length) {
      for (const entity of memoizedConfig.invalidate) {
        await queryClient.invalidateQueries({ queryKey: [entity] });
      }
    }
  }, [entityName, queryClient, memoizedConfig.invalidate]);

  const handleNotification = useCallback(
    (message: string) => {
      if (
        memoizedOptions.showNotifications &&
        !memoizedOptions.suppressSocketAlert
      ) {
        showAlert(message, "info");
      }
    },
    [
      memoizedOptions.showNotifications,
      memoizedOptions.suppressSocketAlert,
      showAlert,
    ]
  );

  useEffect(() => {
    if (!socket.isConnected) return;

    const handleCreate = async (data: any) => {
      await handleInvalidateQueries();

      if (data?.id) {
        queryClient.setQueryData([entityName, data.id], data);
      }

      handleNotification(
        `Novo(a) ${memoizedOptions.entityLabel} foi criado(a)`
      );
    };

    const handleUpdate = async (data: any) => {
      await handleInvalidateQueries();

      if (data?.id) {
        queryClient.setQueryData([entityName, data.id], data);
      }

      handleNotification(`${memoizedOptions.entityLabel} foi atualizado(a)`);
    };

    const handleDelete = async () => {
      await handleInvalidateQueries();

      handleNotification(`${memoizedOptions.entityLabel} foi removido(a)`);
    };

    const handleDependencyChange = async () => {
      await queryClient.invalidateQueries({ queryKey: [entityName] });
      handleNotification(`${memoizedOptions.entityLabel} foi atualizado(a)`);
    };

    const unsubscribeFunctions: (() => void)[] = [
      socket.subscribe(`${entityName}:create`, handleCreate),
      socket.subscribe(`${entityName}:update`, handleUpdate),
      socket.subscribe(`${entityName}:delete`, handleDelete),
      ...memoizedConfig.dependsOn.map((dependency) =>
        socket.subscribe(`${dependency}:update`, handleDependencyChange)
      ),
    ];

    return () => {
      unsubscribeFunctions.forEach((unsubscribe) => unsubscribe());
    };
  }, [
    socket.isConnected,
    entityName,
    queryClient,
    handleInvalidateQueries,
    handleNotification,
    memoizedConfig.dependsOn,
    memoizedOptions.entityLabel,
  ]);

  return socket.isConnected;
}

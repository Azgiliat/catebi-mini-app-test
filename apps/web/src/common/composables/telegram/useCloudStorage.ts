import { customRef, ref } from "vue";

export const useCloudStorage = <T>(key: string) => {
  const isPending = ref(false);
  let _value: T | undefined;

  const value = customRef<T | undefined>((track, trigger) => {
    return {
      get() {
        track();
        return _value;
      },
      set(newValue: T | undefined) {
        window.Telegram.WebApp.CloudStorage.setItem(
          key,
          JSON.stringify(newValue),
          (error) => {
            if (!error) {
              _value = newValue;
              trigger();
            }
          },
        );
      },
    };
  });

  window.Telegram.WebApp.CloudStorage.getItem(key, (error, cloudValue) => {
    if (!error) {
      value.value = JSON.parse(cloudValue);
    }
  });

  return {
    value,
    isPending,
  };
};

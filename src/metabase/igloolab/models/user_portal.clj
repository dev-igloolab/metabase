(ns metabase.igloolab.models.user-portal
  "Persistence for Igloolab's user-specific interface assignment."
  (:require
   [methodical.core :as methodical]
   [toucan2.core :as t2]))

(methodical/defmethod t2/table-name :model/IgloolabUserPortal [_model]
  :igloolab_user_portal)

(derive :model/IgloolabUserPortal :metabase/model)

(def default-interface
  "Interface used when a user has no custom assignment."
  "metabase")

(defn user-interface
  "Return the assigned interface. Missing rows deliberately mean regular Metabase."
  [user-id]
  (or (t2/select-one-fn :interface_type :model/IgloolabUserPortal :user_id user-id)
      default-interface))

(defn set-user-interface!
  "Assign an interface. The default is represented by no row to keep custom data minimal."
  [user-id interface-type]
  (t2/with-transaction [_]
    (if (= interface-type default-interface)
      (t2/delete! :model/IgloolabUserPortal :user_id user-id)
      (if (t2/exists? :model/IgloolabUserPortal :user_id user-id)
        (t2/update! :model/IgloolabUserPortal :user_id user-id
                    {:interface_type interface-type})
        (t2/insert! :model/IgloolabUserPortal
                    {:user_id user-id, :interface_type interface-type}))))
  interface-type)

(ns metabase.igloolab.portal.api
  "API for the isolated Igloolab user portal configuration."
  (:require
   [metabase.api.common :as api]
   [metabase.api.macros :as api.macros]
   [metabase.igloolab.models.user-portal :as portal]
   [metabase.users.core :as users]
   [metabase.util.malli.schema :as ms]
   [toucan2.core :as t2]))

(def InterfaceResponse
  "Response containing the interface assigned to a user."
  [:map [:interface_type [:enum "metabase" "portal"]]])

(def AssignmentResponse
  "Explicit interface assignment for one user."
  [:map
   [:user_id ms/PositiveInt]
   [:interface_type [:enum "metabase" "portal"]]])

(api.macros/defendpoint :get "/current" :- InterfaceResponse
  "Return the interface assigned to the authenticated user."
  []
  {:interface_type (if api/*is-superuser?*
                     portal/default-interface
                     (portal/user-interface api/*current-user-id*))})

(api.macros/defendpoint :get "/assignments" :- [:sequential AssignmentResponse]
  "Return all explicit interface assignments. Only administrators may inspect assignments."
  []
  (api/check-superuser)
  (t2/select [:model/IgloolabUserPortal :user_id :interface_type]))

(api.macros/defendpoint :put "/user/:id" :- InterfaceResponse
  "Assign a user's interface. Only administrators may change assignments."
  [{:keys [id]} :- [:map [:id ms/PositiveInt]]
   _query-params
   {:keys [interface_type]} :- [:map
                                [:interface_type [:enum "metabase" "portal"]]]]
  (api/check-superuser)
  (api/check-404 (users/fetch-user :id id))
  {:interface_type (portal/set-user-interface! id interface_type)})

(def ^{:arglists '([request respond raise])
       :doc "Ring routes for the Igloolab portal API."} routes
  (api.macros/ns-handler *ns*))

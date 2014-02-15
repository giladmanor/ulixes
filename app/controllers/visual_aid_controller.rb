class VisualAidController < AdminController
  
  def index
    
  end
  
  def show
    render params[:id]
  end
  
  
  def get_node_trace
    node = @account.nodes.find(params[:id])
    render :json=>{:name=>node.name,:size=>node.users.size,:actions=>node.user_events.map{|k,v| {:name=>k,:value=>v}}} 
  end
  
  
end

class Sparse
  GRAD = [0.1,0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9,1,0.9,0.8,0.7,0.6,0.5,0.4,0.3,0.2,0.1]
  
  def initialize
    @dimentions = {}
  end
  
  
  def <<(point)
    point.each{|k,v|
      @dimentions[k] = {} if @dimentions[k].nil?
      smudge(v).each{|h|
        @dimentions[k].merge!(h){|key,ov,nv| (ov||0)+nv}
      }
       
    }
  end
  
  def smudge(v)
    GRAD.map.with_index{|g,i| {(v - GRAD.length/2 + i)=>g}}  
  end
  
  
  def to_s
    @dimentions.map{|k,va| "#{k}=>#{va}"}.join("\n")
  end
  
end
